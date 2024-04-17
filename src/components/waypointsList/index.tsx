'use client'

import { useDispatch } from 'react-redux';
import { useEffect, useState } from "react";

import { Waypoint } from "@/store/uavSlice";
import { removeWaypoint } from "@/store/uavSlice";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { FiTrash } from "react-icons/fi"

const WaypointsList = ({ waypoints }: { waypoints: Waypoint[] }) => {
  const [dropdownItems, setDropdownItems] = useState(['Home / Takeoff']);
  const dispatch = useDispatch();

  useEffect(() => {
    if (waypoints.length === 0) return;
    const listItems = waypoints.map((waypoint, index) => {
      if (index === 0) {
        return 'Home / Takeoff';
      } else {
        return `${index} - ${waypoint.type} ${waypoint.dist.toFixed(1)}Km`;
      }
    });
    listItems.push(`Total distance ${waypoints[0].dist.toFixed(1)}Km`);
    setDropdownItems(listItems);
  }, [waypoints]);


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
        {dropdownItems.map((waypoint, index) => (
          <DropdownItem key={index} textValue={waypoint} onMouseEnter={() => handleHoverItem(index)}>
            <div className="flex justify-between items-center">
              <span>{waypoint}</span>
              {(index > 0 && index < dropdownItems.length - 1) &&
                <FiTrash className="ml-2" onClick={() => handleDeleteWaypoint(index)} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
              }
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
