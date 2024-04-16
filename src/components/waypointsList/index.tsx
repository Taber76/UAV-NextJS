'use client'

import { useDispatch } from 'react-redux';

import { Waypoint } from "@/store/uavSlice";
import { removeWaypoint } from "@/store/uavSlice";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { FiTrash } from "react-icons/fi"

const WaypointsList = ({ waypoints }: { waypoints: Waypoint[] }) => {
  const dispatch = useDispatch();

  const handleDeleteWaypoint = (index: number) => {
    dispatch(removeWaypoint({ uavIndex: 0, index }));
  };

  const handleHoverItem = (index: number) => {
    console.log(index)
  };

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
        {waypoints.map((waypoint, index) => (
          <DropdownItem key={index} textValue={waypoint.type} onMouseEnter={() => handleHoverItem(index)}>
            <div className="flex justify-between items-center">
              <span>{index} - {waypoint.type}</span>
              <FiTrash className="ml-2" onClick={() => handleDeleteWaypoint(index)} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
          </DropdownItem>
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
