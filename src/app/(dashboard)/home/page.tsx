"use client"

import Banner from '@/components/layout/home/Banner'
import Rating from '@/components/layout/home/Rating'
import React from 'react'
import { motion } from 'framer-motion'

const page = () => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Banner />
      <Rating />
    </motion.div>
  )
}

export default page