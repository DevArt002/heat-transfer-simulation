### About

Simulation of an active solar heater (Direct circulation).

### Preview

https://www.loom.com/share/158fdef6511742ed8808a7cc267ede35

### Development

Install dependencies

```
npm i
```

Start dev server

```
npm run start
```

Bundle assets

```
npm run build
```

### Tech stack

- [x] JS/TS
- [x] React.js
- [x] Vite
- [x] Tailwind CSS
- [x] Eslint
- [x] Three.js
- [x] D3

### Implemented features

- [x] Parameters panel
- [x] Representation of solar panel (flat collector), storage tank, and pump as rough 3D entities
- [x] Very basic placeholder heatmap on storage tank
- [x] Visualization of temperature data as SVG
- [x] Log view from pump
- [x] Automatic control of the pump upon simulation start

### Parameter

###### Storage Tank

- H (m): Height of storage tank in meter
- R (m): Radius of storage tank in meter
- T (°C): Temperature of fluid in storage tank
- ρ (kg/m^3): Density of fluid
- C (kJ/(kg·°C)): Specific heat capacity of fluid
- U (J/(m^2·°C)): Heat loss coefficient of storage tank

###### Solar panel

- W (m): Width of solar panel in meter
- H (m): Height of solar panel in meter
- η: Efficiency of solar panel
- U (J/(m^2·°C)): Heat loss coefficient of solar panel

###### Pipe

- R (m): Radius of pipe in meter
- U (J/(m^2·°C)): Heat loss coefficient of pipe

###### Environment

- Speed: Factor for speeding up time flow
- T-Ambient (°C): Ambient temperature

###### Other

- Show Heatmap: Toggle the very basic heatmap

### Known issues and possible solutions

- [ ] Missing several simulation factors such as fluid flow rate, energy consumption by the pump, material properties of pipe and tank, etc.
- [ ] Real-time rotation of directional light should be considered bad practice; consider using a point light or other dummy object instead.
- [ ] Logic for determining heatmap values is absent.
- [ ] All materials of 3D entities can be custom shaders to incorporate the heatmap.
- [ ] Each 3D entity can have its own custom geometry(e.g. gltf/glb); currently, primitive geometries are being used.
- [ ] The data visualization section can include additional charts, such as energy produced, energy lost, pump uptime, etc.
