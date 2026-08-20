"use client";

import { useEffect, useState } from "react";
import { Map } from "@/components/map";
import { Card } from "@/components/card";
import { CraftCard } from "@/components/craft-card";
import { CraftPreview } from "@/components/craft-preview";
import type { CraftSummary, UserPublic } from "@/lib/type";
import { Header } from "@/components/header";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState<UserPublic | null>(null);
  const [craftInView, setCraftInView] = useState<CraftSummary | null>(null);
  const [selectedCraft, setSelectedCraft] = useState<CraftSummary | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCraft(null);
  }, [craftInView?.craftId]);

  return (
    <div className="flex flex-col w-screen h-dvh">
      <Header onFilterChange={setFilterTag} />
      <div className="relative flex-1 min-h-0">
        <Map
          onCraftClick={(craft) => {
            setSelectedUser(null);
            setSelectedCraft(craft);
          }}
          onCraftInView={setCraftInView}
          filterTag={filterTag}
        />
        {craftInView && <CraftPreview craft={craftInView} />}
        {selectedUser && (
          <div className="absolute w-full bottom-0">
            <Card user={selectedUser} onSelectUser={setSelectedUser} />
          </div>
        )}
        {selectedCraft && (
          <div className="absolute w-full bottom-0">
            <CraftCard
              craft={selectedCraft}
              onSelectUser={(user) => {
                setSelectedCraft(null);
                setSelectedUser(user);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
