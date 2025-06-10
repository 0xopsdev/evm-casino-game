'use client'

import { API_URL } from '@/config';
import { SocketContext } from '@/context/socketcontext'
import {HeroUIProvider} from '@heroui/react'
import io from "socket.io-client";

// Export individual socket connections
const crashSocket = io(`${API_URL}/crashx`);

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <SocketContext.Provider value={crashSocket}>
      {children}
      </SocketContext.Provider>
    </HeroUIProvider>
  )
}