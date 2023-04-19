export const isoToDateTimeString = (isoTime: number): string => {
	const isoDate = new Date(isoTime);
	const year = isoDate.getFullYear();
	const month = isoDate.getMonth().toString().padStart(2, '0');
	const date = isoDate.getDate().toString().padStart(2, '0');
	const hour = isoDate.getHours().toString().padStart(2, '0');
	const minute = isoDate.getMinutes().toString().padStart(2, '0');

	return `${year}-${month}-${date}T${hour}:${minute}`;
};
