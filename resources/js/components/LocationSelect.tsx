// import { Select } from "@shopify/polaris";
// import { useEffect, useState } from "react";

// interface Location {
//     id: string;
//     name: string;
// }

// interface Props {
//     locations: Location[];
//     selected: string;
//     onChange: (value: string) => void;
// }

// export default function LocationSelect({
//     locations,
//     selected,
//     onChange,
// }: Props) {
//     const [options, setOptions] = useState<{ label: string; value: string }[]>(
//         []
//     );

//     useEffect(() => {
//         const opts = locations.map((loc) => ({
//             label: loc.name,
//             value: loc.id,
//         }));
//         setOptions(opts);

//         if (!selected) {
//             const defaultLoc = locations.find(
//                 (loc) => loc.name === "Shop location"
//             );
//             if (defaultLoc) {
//                 onChange(defaultLoc.id);
//             }
//         }
//     }, [locations, selected, onChange]);

//     return (
//         <Select
//             label="Select Location"
//             options={options}
//             onChange={onChange}
//             value={selected}
//         />
//     );
// }
