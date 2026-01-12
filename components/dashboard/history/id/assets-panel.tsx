"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { platformLabels } from "@/lib/mock-data"
import { InlineEditableText } from "./inline-editable-text"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { GeneratedAssetResponse } from "@/src/api-client/content-service"
import { platformOptions } from "../../generate-blog-form"
interface AssetsPanelProps {
  assets: GeneratedAssetResponse
}

export function AssetsPanel({ assets }: AssetsPanelProps) {

  

  const handleSaveCaption = (platform: Platform, version: number, newText: string) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.platform === platform && asset.version === version ? { ...asset, text: newText } : asset,
      ),
    )
  }

  // const handleVersionChange = (platform: Platform, newVersion: string) => {
  //   setAssets((prev) =>
  //     prev.map((asset) =>
  //       asset.platform === platform ? { ...asset, is_active: asset.version === Number.parseInt(newVersion) } : asset,
  //     ),
  //   )
  // }

 

  return (
    <Tabs defaultValue={assets.platform[0]} className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 max-w-2xl">
        {assets.platform.map((platform) => (
          <TabsTrigger key={platform} value={platform}>
            {platformLabels[platform]}
            {assetsByPlatform[platform] && (
              <Badge variant="secondary" className="ml-2">
                {assetsByPlatform[platform].length}
              </Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {assets.platform.map((platform) => {
        const platformAssets = assetsByPlatform[platform] || []
        const activeAsset = platformAssets.find((a) => a.is_active) || platformAssets[0]

        return (
          <TabsContent key={platform} value={platform} className="mt-6">
            {platformAssets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">No assets generated for {platformLabels[platform]} yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Assets will appear here once generation completes
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Version Selector */}
                {platformAssets.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Version</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={activeAsset?.version.toString()}
                        onValueChange={(value) => handleVersionChange(platform, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {platformAssets.map((asset) => (
                            <SelectItem key={asset.version} value={asset.version.toString()}>
                              Version {asset.version} {asset.is_active && "(Active)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}

                {activeAsset && (
                  <>
                    {/* Caption Editor */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Caption</CardTitle>
                          {activeAsset.is_active && (
                            <Badge variant="secondary" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <InlineEditableText
                          value={activeAsset.text}
                          onSave={(newText) => handleSaveCaption(platform, activeAsset.version, newText)}
                          fieldName="Caption"
                          postId={assets.platformid}
                          multiline
                          maxLength={activeAsset.meta_data.character_count + 500}
                        />
                      </CardContent>
                    </Card>

                    {/* Meta Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Meta Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Character Count */}
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Character Count</p>
                          <p className="text-sm font-medium">{activeAsset.meta_data.character_count}</p>
                        </div>

                        {/* Hashtags */}
                        {activeAsset.meta_data.hashtags.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Hashtags</p>
                            <div className="flex flex-wrap gap-2">
                              {activeAsset.meta_data.hashtags.map((hashtag, index) => (
                                <Badge key={index} variant="outline">
                                  {hashtag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* First Comment */}
                        {activeAsset.meta_data.first_comment && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">First Comment</p>
                            <InlineEditableText
                              value={activeAsset.meta_data.first_comment}
                              onSave={(newValue) => {
                                setAssets((prev) =>
                                  prev.map((asset) =>
                                    asset.platform === platform && asset.version === activeAsset.version
                                      ? {
                                          ...asset,
                                          meta_data: { ...asset.meta_data, first_comment: newValue },
                                        }
                                      : asset,
                                  ),
                                )
                              }}
                              fieldName="First Comment"
                              postId={assets.platformid}
                              multiline
                            />
                          </div>
                        )}

                        {/* Warnings */}
                        {activeAsset.meta_data.warnings.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Warnings</p>
                            <div className="space-y-2">
                              {activeAsset.meta_data.warnings.map((warning, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                                >
                                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                  <p className="text-sm text-yellow-600 dark:text-yellow-400">{warning}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
