"use client"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

type Props = {}

const NotConnected = (props: Props) => {
  return (
    <div>
        <ConnectButton />
    </div>
  )
}

export default NotConnected