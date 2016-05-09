model foo {
    field id fid: string
}

coleslawDynamo
    .create(options, foo)
    .foo
    .tableName()
    .should.be.equal('foos')
    
done()
