import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectsApi, tasksApi } from '../services/api';
import type { Project, Task } from '../types';
import { Bot, FolderKanban, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pRes, tRes] = await Promise.all([projectsApi.list(), tasksApi.list()]);
        setProjects(pRes.data);
        setTasks(tRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = [
    { label: '我的项目', value: projects.length, icon: FolderKanban, color: 'blue' },
    { label: 'AI 任务', value: tasks.length, icon: Bot, color: 'purple' },
    { label: '进行中', value: projects.filter((p) => p.status === 'in_progress').length, icon: Clock, color: 'amber' },
    { label: '已完成', value: projects.filter((p) => p.status === 'completed').length, icon: CheckCircle, color: 'green' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">你好，{user?.username}</h1>
        <p className="text-gray-500 mt-1">欢迎回到 CodePilot Agent 平台</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {loading ? '-' : value}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-${color}-50`}>
                <Icon size={24} className={`text-${color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近项目</h2>
            <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              查看全部 <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm">加载中...</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <FolderKanban size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">还没有项目</p>
              <Link to="/projects" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                创建第一个项目
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <Link key={p.id} to="/projects" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.task_count} 个任务</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    p.status === 'completed' ? 'bg-green-100 text-green-700' :
                    p.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {p.status === 'completed' ? '已完成' : p.status === 'in_progress' ? '进行中' : '草稿'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">最近 AI 任务</h2>
            <Link to="/agent" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              新建任务 <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm">加载中...</p>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8">
              <Bot size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">还没有 AI 任务</p>
              <Link to="/agent" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                启动 AI Agent
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((t) => (
                <div key={t.id} className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 text-sm truncate max-w-[250px]">
                      {t.title || t.input.slice(0, 50)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      t.status === 'completed' ? 'bg-green-100 text-green-700' :
                      t.status === 'running' ? 'bg-amber-100 text-amber-700' :
                      t.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {t.status === 'completed' ? '完成' : t.status === 'running' ? '运行中' : t.status === 'failed' ? '失败' : '等待'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{t.agent_type} · {new Date(t.created_at).toLocaleDateString('zh-CN')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
