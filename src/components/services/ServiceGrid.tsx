import { Service } from "@/data/services";
import ServiceCard from "./ServiceCard";
import { motion, Variants } from "framer-motion";

interface ServiceGridProps {
  services: Service[];
  onRequestClick?: (serviceId: string) => void;
}

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
};

const ServiceGrid = ({ services, onRequestClick }: ServiceGridProps) => {
  return (
    <motion.div
      key={services.map((s) => s.id).join("-")}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {services.map((service) => (
        <motion.div key={service.id} variants={item}>
          <ServiceCard service={service} onRequestClick={onRequestClick} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ServiceGrid;
