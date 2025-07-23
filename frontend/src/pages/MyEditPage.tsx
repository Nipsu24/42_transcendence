import React, { useState, ChangeEvent, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvatarSelector } from '../components/AvatarSelector'
import {
  getMe,
  updateMe,
  uploadAvatar,
  PlayerUpdateRequest,
} from '../services/players'

import defaultAvatar from '../assets/default.png'
import avatar1 from '../assets/1.png'
import avatar2 from '../assets/2.png'
import avatar3 from '../assets/3.png'
import avatar4 from '../assets/4.png'
import avatar5 from '../assets/5.png'
import avatar6 from '../assets/6.png'
import avatar7 from '../assets/7.png'

const AVATAR_OPTIONS: string[] = [
  avatar1, avatar2, avatar3, avatar4,
  avatar5, avatar6, avatar7, defaultAvatar,
]

interface Stats {
  wins: number
  losses: number
  matches: number
}

export default function MyEditPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState(defaultAvatar)
  const [originalAvatar, setOriginalAvatar] = useState(defaultAvatar)
  const [stats, setStats] = useState<Stats>({ wins: 0, losses: 0, matches: 0 })

  // loading / error
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // load profile on mount
  useEffect(() => {
    ;(async () => {
      try {
        const me = await getMe()
        setName(me.name)
        setEmail(me.e_mail)
        setAvatar(me.avatar ?? defaultAvatar)
		setOriginalAvatar(me.avatar ?? defaultAvatar)
        setStats({
          wins: (me as any).wins ?? 0,
          losses: (me as any).losses ?? 0,
          matches: ((me as any).wins ?? 0) + ((me as any).losses ?? 0),
        })
      } catch (error) {
        setError((error as Error).message)
      }
    })()
  }, [])

  // handle static avatar click
  const handleAvatarSelect = async (url: string) => {
    setAvatar(url)
  }

  // open file dialog
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // handle file upload
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
	try {
		const { url } = await uploadAvatar(file)
		setAvatar(url)
		await updateMe({ avatar: url })
	} catch (error: any) {
		if (error.message.includes('File is too large')) {
		  alert('Please select a file smaller than 1MB.')
		} else {
		  alert('Upload failed. Please try again.')
		}
	} finally {
      setLoading(false)
    }
  }


  // save name & email
  const handleSave = async () => {
    setLoading(true); setError(null)
    try {
    //   const updates: PlayerUpdateRequest[] = []
    //   if (name) updates.push({ name })
    //   if (email) updates.push({ e_mail: email })
	//   if (avatar) updates.push({ avatar: avatar })

    //   for (const upd of updates) {
    //     await updateMe(upd)
    //   }

	// Update name
	if (name) await updateMe({ name: name })

	// Update email
	if (email) await updateMe({ e_mail: email })

	// Update avatar
	if (avatar) await updateMe({ avatar: avatar })

	  const me = await getMe()
	  setAvatar(me.avatar ?? defaultAvatar)
	  setName(me.name)
	  setEmail(me.e_mail)
      navigate('/me')
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
		{/* Cancel */}
		<button
		  onClick={async () => {
			try {
			  await updateMe({ avatar: originalAvatar }) // update to original
			  setAvatar(originalAvatar)                  // update UI state
			  navigate('/me')                            // redirect
			} catch (error) {
			  console.error('Failed to revert avatar on cancel', error)
			}
		  }}
		  className="absolute top-4 right-6 z-50 text-black text-sm sm:text-base font-medium hover:opacity-60 transition"
        >
          × CANCEL
        </button>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative">

        {/* Left: static avatar options */}
        <AvatarSelector
          selected={avatar}
          options={AVATAR_OPTIONS}
          onSelect={handleAvatarSelect}
        />

        {/* Right: form & buttons */}
        <div className="space-y-10 my-10 ml-10">
          <h1 className="text-4xl font-heading font-bold text-gray-800">
            Edit your profile!
          </h1>
          <div className="space-y-4 font-body text-gray-700">
            <div>
              <label className="block mb-1 font-medium">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleUploadClick}
              disabled={loading}
              className="font-heading tracking-wider px-4 py-2 bg-gray-400 hover:bg-[#0489C2] text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Uploading…' : 'Upload Avatar'}
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="font-heading tracking-wider px-6 py-2 bg-gray-500 hover:bg-[#26B2C5] text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
)
}
