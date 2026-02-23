import { SpecGrid, SpecItem } from "./SpecUI";

const MotherboardSpec = ({ component }) => (
  <SpecGrid>
    <SpecItem label="Socket" value={component.socket} />
    <SpecItem label="Chipset" value={component.chipset} />
    <SpecItem label="RAM Type" value={component.ram_type} />
    <SpecItem label="Max RAM" value={`${component.max_ram_gb} GB`} />
    <SpecItem label="RAM Slots" value={component.ram_slots} />
    <SpecItem label="Form Factor" value={component.form_factor} />
    <SpecItem label="PCIe Version" value={component.pcie_version} />
  </SpecGrid>
);

export default MotherboardSpec;