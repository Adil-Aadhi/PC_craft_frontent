import { SpecGrid, SpecItem } from "./SpecUI";

const RAMSpec = ({ component }) => (
  <SpecGrid>
    <SpecItem label="Type" value={component.ram_type} />
    <SpecItem label="Capacity" value={`${component.capacity_gb} GB`} />
    <SpecItem label="Frequency" value={`${component.frequency_mhz} MHz`} />
    <SpecItem label="Sticks" value={component.stick_count} />
  </SpecGrid>
);

export default RAMSpec;