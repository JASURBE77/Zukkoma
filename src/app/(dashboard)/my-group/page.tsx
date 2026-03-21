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

export default function Page() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <AppWindowIcon className="mr-2 h-4 w-4" />
          Preview
        </TabsTrigger>

        <TabsTrigger value="code">
          <CodeIcon className="mr-2 h-4 w-4" />
          Code
        </TabsTrigger>  
      </TabsList>
      <TabsContent value="preview">
        <Friends />
      </TabsContent>

      <TabsContent value="code">
        <Lessons />
      </TabsContent>
    </Tabs>
  )
}