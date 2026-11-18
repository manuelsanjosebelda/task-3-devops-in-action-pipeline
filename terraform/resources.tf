resource "kubernetes_manifest" "taskflow_deployment" {
  manifest = yamldecode(
    file("${path.module}/../kubernetes/deployment.yaml")
  )
}

resource "kubernetes_manifest" "taskflow_service" {
  manifest = yamldecode(
    file("${path.module}/../kubernetes/service.yaml")
  )
}
