import React, { useEffect } from "react"
import { Form, Checkbox, Card } from "antd"
import type { UserPreferences } from "@/types"

interface SettingsProps {
    preferences: UserPreferences
    onPreferencesChange: (preferences: UserPreferences) => void
}

const defaultVisibleColumns = ["timestamp", "level", "source", "message", "actions"]

const Settings: React.FC<SettingsProps> = ({ preferences, onPreferencesChange }) => {
    useEffect(() => {
        // Set default preferences if not already set
        if (!preferences.visibleColumns || preferences.visibleColumns.length === 0) {
            onPreferencesChange({ ...preferences, visibleColumns: defaultVisibleColumns })
        }
    }, [preferences, onPreferencesChange])

    const handleColumnToggle = (checkedValues: string[]) => {
        onPreferencesChange({ ...preferences, visibleColumns: checkedValues })
    }

    return (
        <Card title="Log View Settings">
            <Form layout="vertical">
                <Form.Item label="Visible Columns">
                    <Checkbox.Group
                        options={[
                            { label: "Timestamp", value: "timestamp" },
                            { label: "Level", value: "level" },
                            { label: "Source", value: "source" },
                            { label: "Message", value: "message" },
                            { label: "Actions", value: "actions" },
                        ]}
                        value={preferences.visibleColumns || defaultVisibleColumns}
                        onChange={handleColumnToggle}
                    />
                </Form.Item>
            </Form>
        </Card>
    )
}

export default Settings
