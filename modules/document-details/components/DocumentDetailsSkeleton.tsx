import React from "react";

import { Grid, Skeleton } from "@mantine/core";

const DocumentDetailsSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background text-on-surface p-6">
    <div className="max-w-6xl mx-auto">
      <Skeleton h={30} w={150} mb="xl" radius="md" />

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <div className="bg-surface-container/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton h={32} w={300} radius="md" />
                <Skeleton h={16} w={150} radius="md" />
              </div>
              <Skeleton h={36} w={100} radius="md" />
            </div>
            <div className="space-y-4">
              <Skeleton h={20} w={100} radius="md" />
              <Skeleton h={100} w="100%" radius="md" />
              <Skeleton h={20} w={80} radius="md" />
              <Skeleton h={40} w="100%" radius="md" />
            </div>
          </div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <div className="bg-surface-container/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md space-y-6">
            <Skeleton h={24} w={150} radius="md" />
            <div className="space-y-4">
              <Skeleton h={80} w="100%" radius="md" />
              <Skeleton h={80} w="100%" radius="md" />
              <Skeleton h={80} w="100%" radius="md" />
            </div>
          </div>
        </Grid.Col>
      </Grid>
    </div>
  </div>
);

export default DocumentDetailsSkeleton;
