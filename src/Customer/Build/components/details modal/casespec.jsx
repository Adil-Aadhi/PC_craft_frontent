import { SpecGrid, SpecItem } from "./SpecUI";

const CaseSpec = ({ component }) => (
  <SpecGrid>
    <SpecItem label="Supported MB" value={component.supported_form_factors} />
    <SpecItem label="Max GPU Length" value={`${component.max_gpu_length_mm} mm`} />
    <SpecItem
      label="Max Cooler Height"
      value={`${component.max_cpu_cooler_height_mm} mm`}
    />
    <SpecItem label="RGB" value={component.has_rgb ? "Yes" : "No"} />
    <SpecItem label="Side Panel" value={component.side_panel} />
  </SpecGrid>
);

export default CaseSpec;