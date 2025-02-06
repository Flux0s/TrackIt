"use client";

import { useState } from "react";
import { DatePicker } from "../top-bar/DatePicker";

export function DateSelector() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
      </div>
    </div>
  );
}
