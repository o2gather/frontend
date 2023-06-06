export function testid(node: HTMLElement, id: string) {
	if (process.env.NODE_ENV === 'test') {
		node.setAttribute('data-testid', id);
	}
}
