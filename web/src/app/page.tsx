"use client";

import { useEffect, useState } from "react";
import { Map } from "@/components/map";
import { Card } from "@/components/card";
import { CraftCard } from "@/components/craft-card";
import { CraftPreview } from "@/components/craft-preview";
import type { CraftSummary, UserPublic } from "@/lib/type";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null);
  const [craftInView, setCraftInView] = useState<CraftSummary | null>(null);
  const [selectedCraft, setSelectedCraft] = useState<CraftSummary | null>(null);

  useEffect(() => {
    setSelectedCraft(null);
  }, [craftInView?.craftId]);

  return (
    <div className="relative">
      <div className="w-screen h-dvh">
        <Map
          onPinClick={(user) => {
            setSelectedCraft(null);
            setSelectedUser(user);
          }}
          onCraftInView={setCraftInView}
        />
      </div>
      {craftInView && !selectedCraft && (
        <CraftPreview
          craft={craftInView}
          onSelect={() => {
            setSelectedUser(null);
            setSelectedCraft(craftInView);
          }}
        />
      )}
      {selectedUser && (
        <div className="absolute w-full bottom-0">
          <Card user={selectedUser} onSelectUser={setSelectedUser} />
        </div>
      )}
      {selectedCraft && (
        <div className="absolute w-full bottom-0">
          <CraftCard craft={selectedCraft} />
        </div>
      )}
    </div>
  );
};

export default Home;
