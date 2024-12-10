export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'main' | 'secondary' | 'additional' | 'mini';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
  completedPomodoros: number;
  targetPomodoros: number;
} 