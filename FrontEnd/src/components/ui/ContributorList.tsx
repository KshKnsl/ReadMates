import { motion } from "framer-motion";
import UserName from "./UserName";

function ContributorList({ articleData }: { articleData: string[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {articleData.map((contributor, index) => (
        <motion.li
          key={index}
          variants={itemVariants}
          className="bg-amber-100 dark:bg-amber-800 p-2 rounded dark:text-white hover:dark:text-indigo-50 mb-2"
          whileHover={{
            scale: 1.03,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          {index + 1}. <UserName userId={contributor} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default ContributorList;

