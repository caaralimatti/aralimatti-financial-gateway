
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { taskService } from '@/services/taskService';
import { taskCategoryService } from '@/services/taskCategoryService';
import { Task, TaskCategory } from '@/types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskService.fetchTasks();
      setTasks(tasksData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await taskCategoryService.fetchCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    try {
      if (!profile?.id) {
        throw new Error('User profile not found');
      }

      const data = await taskService.createTask(taskData, profile.id);
      await fetchTasks();
      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const data = await taskService.updateTask(taskId, updates);
      await fetchTasks();
      return data;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      await fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  return {
    tasks,
    categories,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};
