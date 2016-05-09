model example {
    field id fid: string
}

coleslawDynamo
    .create(options, example)
    .example
    .should.be.ok
    
done()
