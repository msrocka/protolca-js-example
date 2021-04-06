const loader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')

function printContent(dataService) {

  // impact methods
  handle(dataService.getDescriptors({
    type: 'IMPACT_METHOD'
  }), method => {
    console.log(`impact method: id = ${method.id}, name = ${method.name}`)
  })

  // product systems
  handle(dataService.getDescriptors({
    type: 'PRODUCT_SYSTEM'
  }), system => {
    console.log(`product system: id = ${system.id}, name = ${system.name}`)
  })
}

function handle(call, fn) {
  call.on('data', fn)
  call.on('error', err => {
    console.log('ERROR: ', err)
  })
}

function main() {
  const protos = loader.loadSync('protos/services.proto', {
    enums: String
  })
  const protolca = grpc.loadPackageDefinition(protos).protolca
  // console.log(protolca)

  const dataService = new protolca.services.DataService(
    'localhost:8080',
    grpc.credentials.createInsecure())

  // const call = data.getActors({})
  // call.on('data', (actor) => console.log(actor.name))
  // printContent(dataService)

  const resultService = new protolca.services.ResultService(
    'localhost:8080',
    grpc.credentials.createInsecure())
  resultService.calculate({
    productSystem: { id: 'f2491025-6e05-467c-8721-6d19d3c7f2ed' },
    impactMethod: { id: 'b05a312d-d4eb-4d99-93dd-8a59181c0887' }
  }, (err, result) => {

    
    console.log(err, err)
  })
  /*

console.log(result)
*/
}

main()
