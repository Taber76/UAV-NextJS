'use client'

import React, { useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const DropDownButton: React.FC<{ uavs: any[]; handleSelectedUav: (socketId: string) => void }> = ({ uavs, handleSelectedUav }) => {
  const [buttonText, setButtonText] = useState('SELECT UAV');

  const handleItemClick = (key: string, value: string, socketId: string) => {
    if (key === 'No Id') {
      setButtonText('SELECT UAV');
      handleSelectedUav('');
    } else {
      setButtonText(value);
      handleSelectedUav(socketId);
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
            onClick={() => handleItemClick(item.uavId, item.uavname, item.socketId)}
          >
            {item.uavname}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropDownButton
