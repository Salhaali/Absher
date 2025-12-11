import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface User {
  id: string
  email: string
  full_name: string
  phone_number?: string
  national_id?: string
  date_of_birth?: string
  gender?: string
  role: string
  family_id?: string
}

interface Family {
  id: string
  family_name: string
  city?: string
  region?: string
  main_contact_user_id?: string
}

interface AuthState {
  user: User | null
  family: Family | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (emailOrPhone: string, password: string) => Promise<void>
  register: (userData: Partial<User>, password: string, familyData?: Partial<Family>) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  family: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (emailOrPhone: string, password: string) => {
    try {
      const isEmail = emailOrPhone.includes('@')
      const { data, error } = isEmail
        ? await supabase.auth.signInWithPassword({ email: emailOrPhone, password })
        : await supabase.auth.signInWithPassword({ phone: emailOrPhone, password })

      if (error) throw error

      if (data.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (userData) {
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          })

          if (userData.family_id) {
            const { data: familyData } = await supabase
              .from('families')
              .select('*')
              .eq('id', userData.family_id)
              .single()

            if (familyData) {
              set({ family: familyData })
            }
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  register: async (userData: Partial<User>, password: string, familyData?: Partial<Family>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password,
      })

      if (error) throw error

      if (data.user) {
        const hashPassword = async (pwd: string) => {
          const enc = new TextEncoder().encode(pwd)
          const digest = await crypto.subtle.digest('SHA-256', enc)
          const bytes = Array.from(new Uint8Array(digest))
          return bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
        }

        const password_hash = await hashPassword(password)
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: userData.email,
              full_name: userData.full_name,
              phone_number: userData.phone_number,
              national_id: userData.national_id,
              date_of_birth: userData.date_of_birth,
              gender: userData.gender,
              role: userData.role || 'عضو',
              password_hash,
            },
          ])

        if (profileError) throw profileError

        // Try to create family if provided; don't block registration on failure
        let createdFamily: Family | null = null
        if (familyData && familyData.family_name) {
          const { data: famInsert, error: famError } = await supabase
            .from('families')
            .insert([
              {
                family_name: familyData.family_name,
                city: familyData.city,
                region: familyData.region,
                main_contact_user_id: data.user.id,
              },
            ])
            .select('*')
            .single()

          if (!famError && famInsert) {
            createdFamily = famInsert as Family
            await supabase
              .from('users')
              .update({ family_id: createdFamily.id })
              .eq('id', data.user.id)

            // create self relation
            await supabase
              .from('family_members')
              .insert([
                {
                  family_id: createdFamily.id,
                  user_id: data.user.id,
                  relation_type: userData.role || 'عضو',
                },
              ])
          }
        }

        set({
          user: {
            id: data.user.id,
            email: userData.email!,
            full_name: userData.full_name!,
            phone_number: userData.phone_number,
            national_id: userData.national_id,
            date_of_birth: userData.date_of_birth,
            gender: userData.gender,
            role: userData.role || 'عضو',
            family_id: createdFamily?.id,
          },
          family: createdFamily,
          isAuthenticated: true,
          isLoading: false,
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut()
      set({
        user: null,
        family: null,
        isAuthenticated: false,
        isLoading: false,
      })
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  checkAuth: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (userData) {
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          })

          if (userData.family_id) {
            const { data: familyData } = await supabase
              .from('families')
              .select('*')
              .eq('id', userData.family_id)
              .single()

            if (familyData) {
              set({ family: familyData })
            }
          }
        }
      } else {
        const demoMode = import.meta.env.VITE_DEMO_MODE === 'true'
        if (demoMode) {
          const resp = await fetch('/api/family-first')
          const { family } = await resp.json()
          set({
            user: family ? { id: 'demo', email: 'demo@absher', full_name: 'زائر', role: 'عضو', family_id: family.id } as any : null,
            family: family || null,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          set({ isLoading: false })
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      set({ isLoading: false })
    }
  },
}))
