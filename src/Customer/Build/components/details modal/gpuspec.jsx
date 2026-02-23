import { SpecGrid, SpecItem } from "./SpecUI";

const GPUSpec = ({ component }) => (
  <SpecGrid>
    <SpecItem label="Memory" value={`${component.memory_gb} GB`} />
    <SpecItem label="Memory Type" value={component.memory_type} />
    <SpecItem label="Length" value={`${component.length_mm} mm`} />
    <SpecItem label="TDP" value={`${component.tdp} W`} />
    <SpecItem
      label="Recommended PSU"
      value={`${component.recommended_psu_watt} W`}
    />
  </SpecGrid>
);

export default GPUSpec;