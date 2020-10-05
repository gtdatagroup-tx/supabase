import Supabase from '@supabase/supabase-js'
const { SNOWPACK_PUBLIC_SUPABASE_URL, SNOWPACK_PUBLIC_SUPABASE_KEY } = import.meta.env

const supabase = Supabase.createClient(SNOWPACK_PUBLIC_SUPABASE_URL, SNOWPACK_PUBLIC_SUPABASE_KEY)
export const addTask = async (task_text, list_id) => {
  try {
    let { body } = await supabase.from('tasks').insert([{ task_text, list_id }])
    return body
  } catch (error) {
    console.log('error', error)
  }
}

export const updateTask = async (task_id, values) => {
  try {
    let { body } = await supabase.from('tasks').eq('id', task_id).update(values)
    return body
  } catch (error) {
    console.log('error', error)
  }
}
export const deleteTask = async (task_id) => {
  try {
    let { body } = await supabase.from('tasks').delete().eq('id', task_id)
    return body
  } catch (error) {
    console.log('error', error)
  }
}
export const createList = async (user_id, name) => {
  try {
    let { body } = await supabase.from('lists').insert([{ user_id, name }])
    return body[0]
  } catch (error) {
    console.log('error', error)
  }
}

export const fetchList = async (id) => {
  try {
    let { body } = await supabase.from('lists').eq('id', id).select(`*, tasks(*)`).single()
    return body
  } catch (error) {
    console.log('error', error)
  }
}
