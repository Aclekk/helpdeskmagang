import { Service } from "@/data/services";
import ServiceCard from "./ServiceCard";
import { motion, Variants } from "framer-motion";

interface ServiceGridProps {
  services: Service[];
  onRequestClick?: (serviceId: string) => void;
}

const ServiceGrid = ({ services, onRequestClick }: ServiceGridProps) => {
  // 🎬 Container animation - Smooth fade in dengan stagger children
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        // Stagger yang lebih lambat untuk efek lebih premium
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  // 🎯 Item animation - Smooth entrance dengan scale & blur
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.92,
      // filter: "blur(4px)", // Blur effect - uncomment kalau mau lebih dramatic
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      // filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8,
      },
    },
  };

  return (
    <motion.div
      // ✅ KEY PROP - Ini yang penting! Force re-render saat services berubah
      key={services.map((s) => s.id).join("-")}
      // 🎨 Grid Layout - Responsive dengan gap yang pas
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible" // ✅ Ubah dari whileInView ke animate
      viewport={{
        once: false, // ✅ Ubah ke false biar bisa animate ulang
        amount: 0.1,
        margin: "0px 0px -100px 0px",
      }}
    >
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          variants={itemVariants}
          // Custom delay based on position untuk wave effect yang lebih natural
          custom={index}
          // Hover animation - Scale subtle saat hover
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
        >
          <ServiceCard
            service={service}
            onRequestClick={onRequestClick}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ServiceGrid;
