import { SpecGrid, SpecItem } from "./SpecUI";

const CPUSpec = ({ component }) => (
  <SpecGrid>
    <SpecItem label="Socket" value={component.socket} />
    <SpecItem label="Cores" value={component.cores} />
    <SpecItem label="Threads" value={component.threads} />
    <SpecItem label="Base Clock" value={`${component.base_clock} GHz`} />
    <SpecItem label="Boost Clock" value={`${component.boost_clock} GHz`} />
    <SpecItem label="TDP" value={`${component.tdp} W`} />
  </SpecGrid>
);

export default CPUSpec;