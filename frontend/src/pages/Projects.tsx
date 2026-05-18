import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../services/api';
import type { Project } from '../types';
import toast from 'react-hot-toast';
import { Plus, FolderKanban, Trash2, Edit3 } from 'lucide-react';

export default function Projects() {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState<string>('other');
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await projectsApi.list();
      return data as Project[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; project_type?: string }) =>
      projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowCreate(false);
      setName('');
      setDescription('');
      toast.success('项目创建成功');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('项目已删除');
    },
  });

  const handleCreate = () => {
    if (!name.trim()) return;
    createMutation.mutate({ name: name.trim(), description: description.trim(), project_type: projectType });
  };

  const typeLabels: Record<string, string> = {
    graduation: '毕业设计',
    course: '课程项目',
    personal: '个人项目',
    other: '其他',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的项目</h1>
          <p className="text-gray-500 mt-1">管理你的毕业设计、课程项目和个人项目</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          新建项目
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">新建项目</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="例如：在线图书管理系统"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="简要描述项目内容和目标"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目类型</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="input-field"
                >
                  <option value="graduation">毕业设计</option>
                  <option value="course">课程项目</option>
                  <option value="personal">个人项目</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowCreate(false)} className="btn-secondary">取消</button>
                <button onClick={handleCreate} disabled={!name.trim()} className="btn-primary">
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">加载中...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <FolderKanban size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">还没有项目</h2>
          <p className="text-gray-400 mb-4">创建你的第一个项目开始使用 AI 辅助开发</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary">创建项目</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                  <span className="text-xs text-gray-500 mt-1 inline-block">
                    {typeLabels[p.project_type] || p.project_type}
                  </span>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(p.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {p.description || '暂无描述'}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{p.task_count} 个任务</span>
                <span className={`px-2 py-0.5 rounded-full ${
                  p.status === 'completed' ? 'bg-green-100 text-green-700' :
                  p.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {p.status === 'completed' ? '已完成' : p.status === 'in_progress' ? '进行中' : '草稿'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
