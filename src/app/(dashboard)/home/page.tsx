"use client"

import Banner from '@/components/layout/home/Banner'
import React from 'react'
import { motion } from 'framer-motion'

const page = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Banner />
      
    </motion.div>
  )
}

export default page