import Header from "@/components/Header";
import Progress from "@/components/Progress";
import Slider from "@/components/Slider";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";
import Task from "@/models/Task";
import { AnimatePresence, motion, Reorder, useTransform } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const taskCardVariants = {
  initial: { opacity: 0, y: -20, scaleY: 0.75 },
  idle: { opacity: 1, y: 0, scaleY: 1 },
  completed: {
    opacity: 1,
    scaleX: 1.2,
    scaleY: 1.2,
    rotateX: 360,
    transition: { duration: 0.5 },
  },
  exit: (param: boolean) => ({
    opacity: 0,
    scale: param ? 1 : 0.8,
    x: param ? 200 : 0,
  }),
};

// const taskCardButtonVariants = {
//   idle: { opacity: 0 },
//   hovered: { opacity: 0.5 },
// };

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  function save(tasks: Task[]) {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function load() {
    const loadedTasks = window.localStorage.getItem("tasks");
    const loadedCompletedTasks = window.localStorage.getItem("completed_tasks");

    if (loadedTasks && loadedTasks?.length > 0)
      setTasks(JSON.parse(loadedTasks));
    if (loadedCompletedTasks && loadedCompletedTasks?.length > 0)
      setCompletedTasks(JSON.parse(loadedCompletedTasks));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-11/12 md:w-1/2 2xl:w-1/4 mx-auto my-24 ">
        <Header
          completedTaskCount={completedTasks.length}
          taskCount={tasks.length}
        />
        <TaskForm save={save} setTasks={setTasks} tasks={tasks} />
        <Reorder.Group
          axis="y"
          values={tasks}
          onReorder={(tasks: Task[]) => {
            setTasks((prev) => {
              save(tasks);
              return tasks;
            });
          }}
          className="mt-12 space-y-4 w-9/12 md:w-10/12 mx-auto "
        >
          <AnimatePresence>
            {tasks.map((task) => (
              <Reorder.Item
                variants={taskCardVariants}
                custom={task.completed}
                initial={"initial"}
                animate={task.completed ? "completed" : "idle"}
                whileHover={"hovered"}
                exit={"exit"}
                value={task}
                drag="y"
                layout
                key={task.id}
                className={`w-full relative bg-[#1B1B22] h-fit rounded-2xl p-2 md:p-4 shadow-xl`} //task
              >
                <TaskCard
                  save={save}
                  setCompletedTasks={setCompletedTasks}
                  setTasks={setTasks}
                  task={task}
                  tasks={tasks}
                  key={task.id}
                />
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </main>
    </>
  );
}
