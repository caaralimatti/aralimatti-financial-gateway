
import { supabase } from '@/integrations/supabase/client';
import { TaskCategory } from '@/types/task';

export const taskCategoryService = {
  async fetchCategories(): Promise<TaskCategory[]> {
    const { data, error } = await supabase
      .from('task_categories')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return data || [];
  }
};
