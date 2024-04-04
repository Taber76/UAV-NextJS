'use client'

import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const DropDownButton = ({ uavs }: { uavs: any[] }) => {
  const [buttonText, setButtonText] = useState('SELECT UAV');

  useEffect(() => {
    uavs.push({
      uavname: "Desconectar",
      uavId: 'No Id'
    })
  }, [uavs]);

  const handleItemClick = (key: string) => {
    if (key === 'No Id') {
      setButtonText('SELECT UAV');
    } else {
      setButtonText(key);

      // handle item click
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          size='sm'
          variant="solid"
          color="primary"
          style={{ width: "150px" }}
        >
          {buttonText}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={uavs}>
        {(item) => (
          <DropdownItem
            key={item.uavId}
            color={item.uavId === "No Id" ? "danger" : "default"}
            className={item.uavId === "No Id" ? "text-danger" : ""}
            onClick={() => handleItemClick(item.uavId)}
          >
            {item.uavname}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropDownButton
