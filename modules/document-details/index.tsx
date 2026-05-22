import React from "react";
import { MdArrowBack } from "react-icons/md";

import { Grid, Skeleton } from "@mantine/core";

import { STRINGS } from "@/shared/constants/strings.constants";

import DocumentEditForm from "./components/DocumentEditForm";
import DocumentHeader from "./components/DocumentHeader";
import DocumentInfo from "./components/DocumentInfo";
import DocumentTimeline from "./components/DocumentTimeline";
import LocalizedErrorBoundary from "./components/ErrorBoundary";
import { useDocumentDetails } from "./hooks/useDocumentDetails";

const DocumentDetails: React.FC = () => {
  const {
    id,
    documentData,
    timelineItems,
    isLoading,
    error,
    isDeleting,
    handleDelete,
    handleBack,
    selectedVersionId,
    selectedVersion,
    onSelectVersion,
    onDeleteVersion,
    isEditing,
    setIsEditing,
    isCreateNewVersion,
    setIsCreateNewVersion,
    showCreateNewOption,
    form,
    isSubmitting,
    onSubmit,
  } = useDocumentDetails();

  if (isLoading) {
    return (
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
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-surface-container/50 rounded-2xl p-8 border border-red-500/20 backdrop-blur-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Document</h2>
          <p className="text-sm text-outline mb-6">
            We couldn't retrieve the details for this document. It may have been deleted.
          </p>
          <button
            onClick={handleBack}
            className="bg-white/5 hover:bg-white/10 text-on-surface px-6 py-2.5 rounded-lg border border-white/5 transition-colors font-medium text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <LocalizedErrorBoundary>
      <div className="min-h-screen bg-background text-on-surface p-6">
        <div className="max-w-6xl mx-auto">
          <button
            className="flex items-center gap-2 text-outline hover:text-on-surface mb-6 transition-colors font-medium text-sm group"
            onClick={handleBack}
          >
            <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />{" "}
            {STRINGS.details.back}
          </button>

          <Grid gutter="xl">
            {/* Left Column: Info card / edit form */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <div className="bg-surface-container/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md shadow-xl inner-glow">
                <DocumentHeader
                  id={id}
                  filename={selectedVersion?.data?.filename || documentData?.filename}
                  isDeleting={isDeleting}
                  onDelete={handleDelete}
                  onEdit={() => setIsEditing(true)}
                  isEditing={isEditing}
                  versionNumber={selectedVersion?.version_number}
                  versionSource={selectedVersion?.source}
                />

                {isEditing ? (
                  <DocumentEditForm
                    form={form}
                    isSubmitting={isSubmitting}
                    onSubmit={onSubmit}
                    onCancel={() => setIsEditing(false)}
                    isCreateNewVersion={isCreateNewVersion}
                    setIsCreateNewVersion={setIsCreateNewVersion}
                    showCreateNewOption={showCreateNewOption}
                  />
                ) : (
                  <DocumentInfo
                    category={documentData?.category}
                    summary={documentData?.summary}
                    summary_title={documentData?.summary_title}
                    tags={documentData?.tags}
                  />
                )}
              </div>
            </Grid.Col>

            {/* Right Column: Versions list / history */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <div className="bg-surface-container/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md shadow-xl inner-glow">
                <DocumentTimeline
                  timelineItems={timelineItems}
                  selectedVersionId={selectedVersionId}
                  onSelectVersion={onSelectVersion}
                  onDeleteVersion={onDeleteVersion}
                />
              </div>
            </Grid.Col>
          </Grid>
        </div>
      </div>
    </LocalizedErrorBoundary>
  );
};

export default DocumentDetails;

