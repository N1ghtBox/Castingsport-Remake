import type { Contestant } from "@/types/Contestant";
import { Transfer, type TransferProps } from "antd";
import { useState } from "react";
import { toast } from "sonner";

type TeamMemberSelectorProps = {
    contestants: Contestant[]
    onChange: (ids: Array<Contestant["id"]>) => void
}

const TeamMemberSelector = ({ contestants, onChange }: TeamMemberSelectorProps) => {
    const [targetKeys, setTargetKeys] = useState<React.Key[]>();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

    const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
        if (newTargetKeys.length > 3) {
            toast.error("Drużyna nie może mieć więcej niż 3 zwodników")
            return;
        }

        setTargetKeys(newTargetKeys);
        onChange(newTargetKeys.map(key => key.toString()))
    };

    const handleSelectChange: TransferProps['onSelectChange'] = (
        sourceSelectedKeys,
        targetSelectedKeys,
    ) => {

        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

    }

    return <Transfer
        style={{ width: 'fit-content' }}
        dataSource={contestants}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={handleChange}
        showSelectAll={false}
        listStyle={{
            width: 200,
            height: 250,
        }}
        locale={{
            "itemsUnit": "Zawodników",
            "itemUnit": "Zawodnik",
            "notFoundContent": "Brak zawodników",
            "searchPlaceholder": "Wyszukaj..."
        }}
        onSelectChange={handleSelectChange}
        titles={["", "Drużyna"]}
        rowKey={(item) => item.id}
        render={(item) => item.name}
        showSearch={{ placeholder: "" }}
        oneWay />
}
export default TeamMemberSelector;