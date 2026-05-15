"use client"

import Friends from "@/components/layout/group/Friends"
import Lessons from "@/components/layout/group/Lessons"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { AppWindowIcon, CodeIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

export default function Page() {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">
            <AppWindowIcon className="mr-2 h-4 w-4" />
            {t("group.friends")}
          </TabsTrigger>

          <TabsTrigger value="code">
            <CodeIcon className="mr-2 h-4 w-4" />
            {t("group.lessons")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <Friends />
        </TabsContent>

        <TabsContent value="code">
          <Lessons />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
