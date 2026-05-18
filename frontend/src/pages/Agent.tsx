import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, agentsApi } from '../services/api';
import type { Task } from '../types';
import toast from 'react-hot-toast';
import { Bot, Send, Loader2, FileText, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AGENT_TYPES = [
  { value: 'planner', label: 'Planner', desc: '任务规划与分解' },
  { value: 'coder', label: 'Coder', desc: '代码生成' },
  { value: 'debug', label: 'Debug', desc: '调试与审查' },
  { value: 'report', label: 'Report', desc: '文档与报告生成' },
];

export default function AgentPage() {
  const [input, setInput] = useState('');
  const [agentType, setAgentType] = useState('planner');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await tasksApi.list();
      return data as Task[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { agent_type: string; title: string; input: string }) =>
      tasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('任务已创建');
    },
  });

  const executeMutation = useMutation({
    mutationFn: (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      return agentsApi.execute({
        task_id: taskId,
        agent_type: task?.agent_type || 'planner',
        input: task?.input || '',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Agent 执行完成');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || '执行失败');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => tasksApi.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setSelectedTask(null);
      toast.success('任务已删除');
    },
  });

  const handleSubmit = () => {
    if (!input.trim()) return;
    createMutation.mutate({
      agent_type: agentType,
      title: input.slice(0, 50),
      input: input.trim(),
    });
    setInput('');
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left: Task List */}
      <div className="w-80 flex-shrink-0 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Agent</h1>

        {/* Agent Type Selector */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {AGENT_TYPES.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => setAgentType(value)}
              className={`p-3 rounded-xl border text-left transition-colors ${
                agentType === value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-sm">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="输入你的需求..."
            className="input-field flex-1 text-sm"
          />
          <button onClick={handleSubmit} disabled={!input.trim() || createMutation.isPending} className="btn-primary px-4">
            <Send size={18} />
          </button>
        </div>

        {/* Task History */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <Bot size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">还没有任务</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedTask?.id === task.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <p className="text-sm font-medium text-gray-900 truncate">
                  {task.title || task.input.slice(0, 40)}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{task.agent_type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-700' :
                    task.status === 'running' ? 'bg-amber-100 text-amber-700' :
                    task.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {task.status === 'completed' ? '完成' : task.status === 'running' ? '运行中' : task.status === 'failed' ? '失败' : '等待'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Agent Output */}
      <div className="flex-1 flex flex-col">
        <div className="card flex-1 p-6 overflow-y-auto">
          {selectedTask ? (
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <h2 className="font-semibold text-gray-900">{selectedTask.title || '任务详情'}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Agent: {selectedTask.agent_type} · 状态: {selectedTask.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedTask.status === 'pending' && (
                    <button
                      onClick={() => executeMutation.mutate(selectedTask.id)}
                      disabled={executeMutation.isPending}
                      className="btn-primary text-sm flex items-center gap-1"
                    >
                      {executeMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />}
                      执行
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(selectedTask.id)}
                    className="btn-secondary text-sm flex items-center gap-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">输入</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap">
                  {selectedTask.input}
                </div>
              </div>

              {selectedTask.output && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">输出</h3>
                  <div className="bg-gray-50 rounded-lg p-4 prose prose-sm max-w-none">
                    <ReactMarkdown>{selectedTask.output}</ReactMarkdown>
                  </div>
                </div>
              )}

              {selectedTask.error_message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-sm font-medium text-red-700">错误</p>
                  <p className="text-sm text-red-600 mt-1">{selectedTask.error_message}</p>
                </div>
              )}

              {!selectedTask.output && selectedTask.status === 'pending' && (
                <div className="text-center py-12">
                  <Bot size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">点击"执行"启动 Agent</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bot size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">CodePilot Agent</h2>
                <p className="text-gray-500 max-w-md">
                  选择一个 Agent 类型，输入你的需求，<br />
                  让 AI 帮你完成代码生成、项目规划、文档撰写等工作
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
