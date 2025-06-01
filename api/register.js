/* eslint-env node */
/* global process */
import { createClient } from '@supabase/supabase-js'

// Initialise le client seulement si toutes les variables sont disponibles
let supabaseAdmin = null
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export default async function handler(req, res) {
  console.log('Register handler invoked', { method: req.method, body: req.body })
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('SUPABASE_SERVICE_ROLE_KEY missing')
    return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY missing' })
  }
  if (!supabaseAdmin) {
    console.log('Supabase admin client not initialised')
    res.status(500).json({ error: 'Server misconfigured' })
    return
  }
  if (req.method !== 'POST') {
    console.log(`Method not allowed: ${req.method}`)
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { fullName, email, password } = req.body
  if (!fullName || !email || !password) {
    console.log('Missing fields in request body', { fullName, email, password })
    res.status(400).json({ error: 'Missing fields' })
    return
  }

  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })
    if (authError) throw authError

    const [firstName, ...rest] = fullName.split(' ')
    const lastName = rest.join(' ')

    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role: 'client'
    })
    if (profileError) throw profileError

    console.log('User successfully registered', { userId: authData.user.id })
    res.status(200).json({ user: authData.user })
  } catch (error) {
    console.error('Error during registration', error)
    res.status(500).json({ error: error.message })
  }
}
