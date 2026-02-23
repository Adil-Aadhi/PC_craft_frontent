import { SpecGrid, SpecItem } from "./SpecUI";

const StorageSpec = ({ component }) => (
  <SpecGrid>
    <SpecItem label="Type" value={component.storage_type} />
    <SpecItem label="Interface" value={component.interface} />
    <SpecItem label="Capacity" value={`${component.capacity_gb} GB`} />
    <SpecItem label="Read Speed" value={`${component.read_speed} MB/s`} />
    <SpecItem label="Write Speed" value={`${component.write_speed} MB/s`} />
    <SpecItem label="Form Factor" value={component.form_factor} />
  </SpecGrid>
);

export default StorageSpec;