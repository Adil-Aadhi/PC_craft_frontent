import { SpecGrid, SpecItem } from "./SpecUI";

const PSUSpec = ({ component }) => (
  <SpecGrid>
    <SpecItem label="Wattage" value={`${component.wattage} W`} />
    <SpecItem label="Modular" value={component.modular_type} />
    <SpecItem label="Efficiency" value={component.efficiency_rating} />
    <SpecItem label="Form Factor" value={component.form_factor} />
  </SpecGrid>
);

export default PSUSpec;