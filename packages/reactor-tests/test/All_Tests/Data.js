describe("Grid", function() {
    it("should support the data prop", function() {
        ST.navigate('#/GridData');

        let grid;
        ST.component('Grid')
            .and(g => grid = g)
            .and(() => {
                const data = grid.getStore().getData().items.map(item => item.data);
                expect(data[0].text).toBe('Row 1, 0');
                expect(data[1].text).toBe('Row 2, 0');
                expect(data[2].text).toBe('Row 3, 0');
            })
            .and(() => ST.button('#refresh').click())
            .and(() => {
                const data = grid.getStore().getData().items.map(item => item.data);
                expect(data[0].text).toBe('Row 1, 1');
                expect(data[1].text).toBe('Row 2, 1');
                expect(data[2].text).toBe('Row 3, 1');
            })
            .and(() => ST.button('#clear').click())
            .and(() => {
                const data = grid.getStore().getData().items;
                expect(data.length).toBe(0);
            });
    });
});

describe("Tree", function() {
    it("should support the data prop", function() {
        ST.navigate('#/TreeData');
        
        ST.component('Tree')
            .and(g => grid = g)
            .and(() => {
                const root = grid.getStore().getRoot();
                expect(root.get('text')).toBe('Root 0');
                expect(root.childNodes[0].get('text')).toBe('Child 0');
                expect(root.childNodes[1].get('text')).toBe('Child 0');
                expect(root.childNodes[2].get('text')).toBe('Child 0');
            })
            .and(() => ST.button('#refresh').click())
            .and(() => {
                const root = grid.getStore().getRoot();
                expect(root.get('text')).toBe('Root 1');
                expect(root.childNodes[0].get('text')).toBe('Child 1');
                expect(root.childNodes[1].get('text')).toBe('Child 1');
                expect(root.childNodes[2].get('text')).toBe('Child 1');
            })
            .and(() => ST.button('#clear').click())
            .and(() => {
                expect(grid.getStore().getRoot()).toBe(null);
            });
    })
})