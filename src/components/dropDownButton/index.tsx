'use client'

import React, { useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const DropDownButton = () => {
  const items = [
    {
      key: "new",
      label: "Pajaro Loco I",
    },
    {
      key: "copy",
      label: "Pajaro Loco II",
    },
    {
      key: "edit",
      label: "Desconectar",
    },
  ];

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          size='sm'
          variant="solid"
          color="primary"
          style={{ width: "150px" }}
        >
          SELECT UAV
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dynamic Actions" items={items}>
        {(item) => (
          <DropdownItem
            key={item.key}
            color={item.key === "delete" ? "danger" : "default"}
            className={item.key === "delete" ? "text-danger" : ""}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropDownButton