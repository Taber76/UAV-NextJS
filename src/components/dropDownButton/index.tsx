'use client'

import React, { useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const DropDownButton = ({ uavs }: { uavs: any[] }) => {
  const [buttonText, setButtonText] = useState('SELECT UAV');
  const items = [
    {
      id: 'kggkj45k423g5k23j',
      key: "new",
      uavname: "Pajaro Loco I",
    },
    {
      id: 'kggkj45k423g5k235435j',
      key: "copy",
      uavname: "Pajaro Loco II",
    },
    {
      id: 'kggkj45k3g5k235435j',
      key: "delete",
      uavname: "Desconectar",
    },
  ];

  const handleItemClick = (key: string) => {
    switch (key) {
      case "new":
        setButtonText("Pajaro Loco I");
        break;
      case "copy":
        setButtonText("Pajaro Loco II");
        break;
      case "delete":
        setButtonText("SELECT UAV");
        break;
      default:
        break;
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
      <DropdownMenu aria-label="Dynamic Actions" items={items}>
        {(item) => (
          <DropdownItem
            key={item.id}
            color={item.key === "delete" ? "danger" : "default"}
            className={item.key === "delete" ? "text-danger" : ""}
            onClick={() => handleItemClick(item.key)}
          >
            {item.uavname}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropDownButton
