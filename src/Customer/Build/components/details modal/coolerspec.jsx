import { SpecGrid, SpecItem } from "./SpecUI";

const CoolerSpec = ({ component }) => (
  <SpecGrid>
    <SpecItem label="Type" value={component.cooler_type} />
    <SpecItem label="Supported Sockets" value={component.supported_sockets} />
    {component.cooler_height_mm && (
      <SpecItem label="Height" value={`${component.cooler_height_mm} mm`} />
    )}
    {component.fan_size && (
      <SpecItem label="Fan Size" value={component.fan_size} />
    )}
    {component.description && (
      <SpecItem label="Description" value={component.description} />
    )}
  </SpecGrid>
);

export default CoolerSpec;