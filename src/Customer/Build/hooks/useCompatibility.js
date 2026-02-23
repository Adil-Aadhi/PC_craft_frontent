import { useSelector } from "react-redux";

export const useCompatibility = () => {
  const build = useSelector((state) => state.build.selected);

  const checkCompatibility = (category, item) => {
    let compatibility = "good";
    let message = "";

    // CPU ↔ Motherboard
    if (category === "motherboard" && build.cpu) {
      if (item.socket !== build.cpu.socket) {
        compatibility = "bad";
        message = `Requires ${build.cpu.socket} socket`;
      }
    }

    // RAM ↔ Motherboard
    if (category === "ram" && build.motherboard) {
      if (item.ram_type !== build.motherboard.ram_type) {
        compatibility = "bad";
        message = `Requires ${build.motherboard.ram_type} RAM`;
      }
    }

    // Cooler ↔ CPU socket
    if (category === "cooler" && build.cpu) {
      const supported = item.supported_sockets?.split(",") || [];
      if (!supported.includes(build.cpu.socket)) {
        compatibility = "bad";
        message = `Cooler doesn't support ${build.cpu.socket}`;
      }
    }

    // Cooler height ↔ Case
    if (category === "cooler" && build.case && item.cooler_height_mm) {
      if (item.cooler_height_mm > build.case.max_cooler_height_mm) {
        compatibility = "bad";
        message = `Cooler too tall for case`;
      }
    }

    // PSU ↔ GPU
    if (category === "psu" && build.gpu) {
      if (item.wattage < build.gpu.recommended_wattage) {
        compatibility = "bad";
        message = `GPU needs ${build.gpu.recommended_wattage}W PSU`;
      }
    }

    if (category === "gpu" && build.psu) {
      if (build.psu.wattage < item.recommended_wattage) {
        compatibility = "bad";
        message = `PSU too weak for GPU`;
      }
    }

    // GPU ↔ Case
    if (category === "gpu" && build.case && item.length_mm) {
      if (item.length_mm > build.case.max_gpu_length_mm) {
        compatibility = "bad";
        message = `GPU too long for case`;
      }
    }

    // Case Fan ↔ Case
    if (category === "casefan" && build.case) {
      const supported = build.case.supported_fan_sizes?.split(",") || [];
      if (!supported.includes(item.fan_size)) {
        compatibility = "bad";
        message = `Case doesn't support ${item.fan_size}mm fan`;
      }
    }

    return { compatibility, message };
  };

  return { checkCompatibility };
};