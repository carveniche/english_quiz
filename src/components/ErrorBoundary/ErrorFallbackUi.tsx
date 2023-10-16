import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Container,
  Grid,
} from "@material-ui/core";
import { Refresh as RefreshIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
    border: "1px solid #E2E4EE",
  },
  errorImage: {
    width: "150px",
  },
  pageSubHead: {
    textAlign: "center",
  },
  primaryButton: {
    margin: theme.spacing(0, 1),
  },
}));

const ErrorFallbackUi = () => {
  const classes = useStyles();

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              color="primary"
              align="center"
              gutterBottom
            >
              Oops...
            </Typography>
          </Grid>
          <Grid item xs={12} className="flex justify-center text-center">
            <img
              className={classes.errorImage}
              src="/static/media/Error-image.png"
              alt="Error"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.pageSubHead} variant="subtitle1">
              Something went wrong, please reload to continue
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Container>
              <Grid container justify="flex-end">
                <Grid item xs={12} className="text-center">
                  <Button
                    className={classes.primaryButton}
                    variant="contained"
                    color="primary"
                    onClick={refreshPage}
                    startIcon={<RefreshIcon />}
                  >
                    Reload
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorFallbackUi;
