'use client'

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, RadioGroup, Radio } from "@nextui-org/react";

const WaypointsList = () => {

  const waypoints = [
    { name: 'Waypoint 1', lat: 0, lon: 0, alt: 0, relative_alt: 0, hdg: 0 },
    { name: 'Waypoint 2', lat: 0, lon: 0, alt: 0, relative_alt: 0, hdg: 0 },
    { name: 'Waypoint 3', lat: 0, lon: 0, alt: 0, relative_alt: 0, hdg: 0 },
    { name: 'Waypoint 4', lat: 0, lon: 0, alt: 0, relative_alt: 0, hdg: 0 },
    { name: 'Waypoint 5', lat: 0, lon: 0, alt: 0, relative_alt: 0, hdg: 0 },
    { name: 'Waypoint 6', lat: 0, lon: 0, alt: 0, relative_alt: 0, hdg: 0 },
    { name: 'Waypoint 7', lat: 0, lon: 0, alt: 0, relative_alt: 0, hdg: 0 },
  ]

  const DropdownContent = () => (
    <Dropdown>
      <DropdownTrigger>
        <Button
          color={'primary'}
          variant={'solid'}
          className="capitalize"
        >
          Waypoints
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Dropdown Variants"
        color={'primary'}
        variant={'solid'}
      >
        {waypoints.map((waypoint) => (
          <DropdownItem key={waypoint.name}>{waypoint.name}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )

  return (
    <div className="flex flex-col gap-1">
      <DropdownContent />
    </div>
  );
}

export default WaypointsList
