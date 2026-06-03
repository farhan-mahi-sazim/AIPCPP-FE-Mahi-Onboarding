import React from "react";

import { Grid } from "@mantine/core";
import { MdArrowBack } from "react-icons/md";

import { STRINGS } from "@/shared/constants/strings.constants";

import DocumentDetailsError from "./components/DocumentDetailsError";
import DocumentDetailsSkeleton from "./components/DocumentDetailsSkeleton";
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
    isSelectedVersionAI,
    isEditing,
    setIsEditing,
    startEditCurrent,
    startOverride,
    isCreateNewVersion,
    setIsCreateNewVersion,
    showCreateNewOption,
    form,
    isSubmitting,
    onSubmit,
  } = useDocumentDetails();

  if (isLoading) {
    return <DocumentDetailsSkeleton />;
  }

  if (error) {
    return <DocumentDetailsError onBack={handleBack} />;
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
            <Grid.Col span={{ base: 12, md: 8 }}>
              <div className="bg-surface-container/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md shadow-xl inner-glow">
                <DocumentHeader
                  id={id}
                  filename={selectedVersion?.data?.filename || documentData?.filename}
                  isDeleting={isDeleting}
                  onDelete={handleDelete}
                  onEdit={startEditCurrent}
                  onOverride={startOverride}
                  canEdit={!isSelectedVersionAI}
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

            <Grid.Col span={{ base: 12, md: 4 }}>
              <div className="bg-surface-container/50 rounded-2xl p-6 border border-white/5 backdrop-blur-md shadow-xl inner-glow">
                <DocumentTimeline
                  timelineItems={timelineItems}
                  selectedVersionId={selectedVersionId ?? undefined}
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
